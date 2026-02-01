using System;
using System.Threading.Tasks;
using QAProject.Questions;
using Volo.Abp.Application.Services;

namespace QAProject.User.Questions;

public interface IQuestionAppService : ICrudAppService<
    QuestionDetailDto,
    QuestionSummaryDto,
    Guid,
    GetListQuestionsDto,
    CreateQuestionDto, UpdateQuestionDto>
{
    Task UpdateStatusAsync(Guid id, QaStatus status);
    Task AddMessageAsync(Guid questionId, CreateUpdateMessageDto input);
    Task UpdateMessageAsync(Guid messageId, CreateUpdateMessageDto input);
}