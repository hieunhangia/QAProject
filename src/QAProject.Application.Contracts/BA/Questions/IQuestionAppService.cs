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
        Task<PagedResultDto<QuestionDto>> GetListQuestionAsync(GetQuestionListInput input);
        Task<MessageDto> SendMessageAsync(SendMessageDto input);
        Task<List<MessageDto>> GetMessagesAsync(Guid questionId);

        
        Task<MessageDto> UpdateMessageAsync(Guid messageId, CreateUpdateMessageDto input);

       
    }
}
