using QAProject.User.Questions;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace QAProject.BA.Questions
{
    public interface IBaQuestionAppService : IApplicationService
    {
        Task<PagedResultDto<QuestionSummaryDto>> GetListQuestionAsync(GetListQuestionsDto input);
        Task<MessageDto> SendMessageAsync(Guid questionId, CreateUpdateMessageDto input);
        Task<QuestionDetailDto> GetQuestionDetailAsync(Guid id);



        Task<MessageDto> UpdateMessageAsync(Guid messageId, CreateUpdateMessageDto input);

       
    }
}
