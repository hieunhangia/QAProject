using QAProject.Questions;
using QAProject.User.Questions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Text;
using System.Threading.Tasks;
using Volo.Abp;
using Volo.Abp.Application.Dtos;
using Volo.Abp.Application.Services;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Linq;
using Volo.Abp.ObjectMapping;

namespace QAProject.BA.Questions
{
    public class QuestionAppService : ApplicationService, IQuestionAppService
    {
        private readonly IRepository<Question, Guid> _questionRepository;

        public QuestionAppService(IRepository<Question, Guid> questionRepository)
        {
            _questionRepository = questionRepository;
        }

        public async Task<PagedResultDto<QuestionDto>> GetListQuestionAsync(GetQuestionListInput input)
        {
           
            var queryable = await _questionRepository.GetQueryableAsync();

           
            queryable = queryable
                .WhereIf(input.AssigneeId.HasValue, x => x.AssigneeId == input.AssigneeId)
                .WhereIf(input.Status.HasValue, x => x.Status == input.Status);

           
            var totalCount = await AsyncExecuter.CountAsync(queryable);

            
            var questions = await AsyncExecuter.ToListAsync(
                queryable.OrderBy(input.Sorting ?? nameof(Question.CreationTime) + " desc")
                         .PageBy(input.SkipCount, input.MaxResultCount)
            );

           
            return new PagedResultDto<QuestionDto>(
                totalCount,
                ObjectMapper.Map<List<Question>, List<QuestionDto>>(questions)
            );
        }
        public async Task<MessageDto> SendMessageAsync(SendMessageDto input)
        {
           
            var question = await _questionRepository.GetAsync(input.QuestionId);

           
            if (question.Status == QaStatus.Closed)
            {
                throw new UserFriendlyException("Cuộc hội thoại này đã đóng, bạn không thể gửi thêm tin nhắn.");
            }

            
            question.AddMessage(input.Content);

           
            await _questionRepository.UpdateAsync(question);

          
            var lastMessage = question.Messages.Last();

            return ObjectMapper.Map<Message, MessageDto>(lastMessage);
        }
    }
}
