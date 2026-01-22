using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using QAProject.Constants;
using QAProject.Permissions;
using QAProject.Questions;
using Volo.Abp;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Authorization;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;
using Volo.Abp.Users;

namespace QAProject.User.Questions;

[Authorize(Roles = Roles.User)]
public class QuestionAppService(IRepository<Question, Guid> repository, IRepository<IdentityUser, Guid> userRepository) :
    CrudAppService<
        Question,
        QuestionDetailDto,
        QuestionSummaryDto,
        Guid,
        PagedAndSortedResultRequestDto,
        CreateQuestionDto, UpdateQuestionDto>(repository),
    IQuestionAppService
{

    public override async Task<QuestionDetailDto> GetAsync(Guid id)
    {
        var queryable = await Repository.GetQueryableAsync();
        var question = await queryable
            .Include(q => q.Assignee)
            .Include(q => q.Messages)
            .ThenInclude(q => q.Creator)
            .FirstOrDefaultAsync(q => q.Id == id);
        
        if (question == null)
        {
            throw new EntityNotFoundException(typeof(Question), id);
        }
        
        if (question.CreatorId != CurrentUser.Id)
        {
            throw new AbpAuthorizationException("Bạn không có quyền truy cập câu hỏi này.");
        }
        
        return await MapToGetOutputDtoAsync(question);
    }

    public override async Task<PagedResultDto<QuestionSummaryDto>> GetListAsync(PagedAndSortedResultRequestDto input)
    {
        var query = await CreateFilteredQueryAsync(input);
        query = query
            .Include(q => q.Assignee)
            .Include(q => q.LastModifier)
            .Where(q => q.CreatorId == CurrentUser.Id);
        var totalCount = await AsyncExecuter.CountAsync(query);

        var entityDtos = new List<QuestionSummaryDto>();

        if (totalCount > 0)
        {
            query = ApplySorting(query, input);
            query = ApplyPaging(query, input);

            var entities = await AsyncExecuter.ToListAsync(query);
            entityDtos = await MapToGetListOutputDtosAsync(entities);
        }

        return new PagedResultDto<QuestionSummaryDto>(
            totalCount,
            entityDtos
        );
    }

    public override async Task<QuestionDetailDto> CreateAsync(CreateQuestionDto input)
    {
        if (await userRepository.FindAsync(u => u.Id == input.AssigneeId) == null)
        {
            throw new UserFriendlyException("Người được giao nhiệm vụ trả lời không tồn tại.");
        }
        
        return await base.CreateAsync(input);
    }

    public override async Task<QuestionDetailDto> UpdateAsync(Guid id, UpdateQuestionDto input)
    {
        var queryable = await Repository.GetQueryableAsync();
        var question = await queryable.Include(q => q.Messages).FirstOrDefaultAsync(q => q.Id == id);
        
        if (question == null)
        {
            throw new EntityNotFoundException(typeof(Question), id);
        }
        
        if (question.CreatorId != CurrentUser.Id)
        {
            throw new AbpAuthorizationException("Bạn không có quyền cập nhật câu hỏi này.");
        }
        
        if (question.Messages.Count != 0)
        {
            throw new UserFriendlyException("Không thể cập nhật câu hỏi đã có câu trả lời.");
        }

        return await base.UpdateAsync(id, input);
    }

    [RemoteService(false)]    
    public override Task DeleteAsync(Guid id) => base.DeleteAsync(id);
}