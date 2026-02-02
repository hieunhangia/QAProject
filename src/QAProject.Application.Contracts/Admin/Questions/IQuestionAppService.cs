using System;
using System.Threading.Tasks;
using QAProject.Questions;
using QAProject.User.Questions;
using Volo.Abp.Application.Services;

namespace QAProject.Admin.Questions;

public interface IQuestionAppService : IReadOnlyAppService<
    QuestionDetailDto,
    QuestionSummaryDto,
    Guid,
    GetListQuestionsDto>;