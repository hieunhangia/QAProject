using System;
using System.Threading.Tasks;
using QAProject.Questions;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace QAProject.User.Questions;

public interface IQuestionAppService : ICrudAppService<
    QuestionDetailDto,
    QuestionSummaryDto,
    Guid,
    PagedAndSortedResultRequestDto,
    CreateQuestionDto, UpdateQuestionDto>
{
    Task UpdateStatusAsync(Guid id, QaStatus status);
    Task AddMessageAsync(Guid questionId, CreateUpdateMessageDto input);
    Task UpdateMessageAsync(Guid messageId, CreateUpdateMessageDto input);
}