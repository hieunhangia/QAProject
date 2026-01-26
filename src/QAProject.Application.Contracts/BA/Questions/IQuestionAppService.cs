using QAProject.User.Questions;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;

namespace QAProject.BA.Questions
{
    public interface IQuestionAppService : IApplicationService
    {
        Task<PagedResultDto<QuestionDto>> GetListQuestionAsync(GetQuestionListInput input);
        Task<MessageDto> SendMessageAsync(SendMessageDto input);
    }
}
