using System;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace QAProject.User.Questions;

public interface IQuestionAppService : ICrudAppService<
    QuestionDetailDto,
    QuestionSummaryDto,
    Guid,
    PagedAndSortedResultRequestDto,
    CreateQuestionDto,UpdateQuestionDto>
{
}