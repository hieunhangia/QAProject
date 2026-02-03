using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Nito.AsyncEx;
using QAProject.Constants;
using QAProject.Questions;
using QAProject.User.Questions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Identity;

namespace QAProject.Admin.Questions;

[Authorize(Roles = Roles.Admin)]
public class AdminQuestionAppService(IRepository<Question, Guid> repository, IRepository<IdentityUser, Guid> identityRepository, IRepository<IdentityRole, Guid> roleRepository) : ReadOnlyAppService<
        Question,
        QuestionDetailDto,
        QuestionSummaryDto,
        Guid,
        GetListQuestionsDto>(repository),
    IAdminQuestionAppService
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

        question.Messages = question.Messages.OrderBy(m => m.CreationTime).ToList();

        return await MapToGetOutputDtoAsync(question);
    }

    public override async Task<PagedResultDto<QuestionSummaryDto>> GetListAsync(GetListQuestionsDto input)
    {
        var query = await CreateFilteredQueryAsync(input);
        query = query
            .Include(q => q.Assignee)
            .Include(q => q.LastModifier);

        input.Q = input.Q?.Trim() ?? string.Empty;
        if (!string.IsNullOrEmpty(input.Q))
        {
            query = query.Where(q => q.Title.Contains(input.Q) || q.Content.Contains(input.Q));
        }

        if (input.Status.HasValue)
        {
            query = query.Where(q => q.Status == input.Status.Value);
        }

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

    public virtual async Task<PagedResultDto<QuestionSummaryDto>> GetListByUserIdAsync(Guid userId, GetListQuestionsDto input)
    {
        var userQuery = await identityRepository.GetQueryableAsync();
        userQuery = userQuery.Include(u => u.Roles).Where(u => u.Id == userId);
        var user  = await AsyncExecuter.FirstOrDefaultAsync(userQuery);
        if (user == null)
        {
            throw new EntityNotFoundException(typeof(IdentityUser), userId);
        }
        var userRole = await roleRepository.FirstOrDefaultAsync(r => r.Name == Roles.User);
        if (user.Roles.All(r => r.RoleId != userRole.Id))
        {
            throw new UserFriendlyException("This account does not have user role");
        }
        var query = await Repository.GetQueryableAsync();

    
        query = query
            .Include(q => q.Assignee)
            .Include(q => q.LastModifier)
            .Where(q => q.CreatorId == userId);

       
        input.Q = input.Q?.Trim() ?? string.Empty;
        if (!string.IsNullOrEmpty(input.Q))
        {
            query = query.Where(q => q.Title.Contains(input.Q) || q.Content.Contains(input.Q));
        }

        
        if (input.Status.HasValue)
        {
            query = query.Where(q => q.Status == input.Status.Value);
        }

       
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

    public virtual async Task<PagedResultDto<QuestionSummaryDto>> GetListAssignedQuestionAsync(Guid baId, GetListQuestionsDto input)
    {
        var userQuery = await identityRepository.GetQueryableAsync();
        userQuery = userQuery.Include(u => u.Roles).Where(u => u.Id == baId);
        var user = await AsyncExecuter.FirstOrDefaultAsync(userQuery);
        if (user == null)
        {
            throw new EntityNotFoundException(typeof(IdentityUser), baId);
        }
        var userRole = await roleRepository.FirstOrDefaultAsync(r => r.Name == Roles.BA);
        if (user.Roles.All(r => r.RoleId != userRole.Id))
        {
            throw new UserFriendlyException("This account does not have BA role");
        }
        var query = await Repository.GetQueryableAsync();


        query = query
            .Include(q => q.Assignee)
            .Include(q => q.LastModifier)
            .Where(q => q.AssigneeId == baId);


        input.Q = input.Q?.Trim() ?? string.Empty;
        if (!string.IsNullOrEmpty(input.Q))
        {
            query = query.Where(q => q.Title.Contains(input.Q) || q.Content.Contains(input.Q));
        }


        if (input.Status.HasValue)
        {
            query = query.Where(q => q.Status == input.Status.Value);
        }


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
}