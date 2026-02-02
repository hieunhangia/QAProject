using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QAProject.Constants;
using QAProject.Questions;
using QAProject.User.Questions;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;

namespace QAProject.Admin.Questions;

[Authorize(Roles = Roles.Admin)]
[Route("api/admin")]
public class QuestionAppService(IRepository<Question, Guid> repository) : ReadOnlyAppService<
        Question,
        QuestionDetailDto,
        QuestionSummaryDto,
        Guid,
        GetListQuestionsDto>(repository),
    IQuestionAppService
{
    [HttpGet("questions/{id:guid}")]
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
    
    [HttpGet("questions")]
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
}