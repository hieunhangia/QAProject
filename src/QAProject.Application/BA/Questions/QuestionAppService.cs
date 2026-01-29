using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using QAProject.Constants;
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
using Volo.Abp.Authorization;
using Volo.Abp.Domain.Entities;
using Volo.Abp.Domain.Repositories;
using Volo.Abp.Linq;
using Volo.Abp.ObjectMapping;


namespace QAProject.BA.Questions
{
    [Authorize(Roles = Roles.BA)]
    public class BaQuestionAppService : ApplicationService, IBaQuestionAppService
    {
        private readonly IRepository<Question, Guid> _questionRepository;

        public BaQuestionAppService(IRepository<Question, Guid> questionRepository)
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

        public async Task<List<MessageDto>> GetMessagesAsync(Guid questionId)
        {
            
            var queryable = await _questionRepository.WithDetailsAsync(q => q.Messages);

            var question = await queryable
                .Include(q => q.Messages)
                .ThenInclude(m => m.Creator) 
                .FirstOrDefaultAsync(q => q.Id == questionId);

            if (question == null) throw new EntityNotFoundException(typeof(Question), questionId);

            var messages = question.Messages.OrderBy(m => m.CreationTime).ToList();

            return ObjectMapper.Map<List<Message>, List<MessageDto>>(messages);
        }

        public async Task<MessageDto> UpdateMessageAsync(Guid messageId, CreateUpdateMessageDto input)
        {
           
            var queryable = await _questionRepository.WithDetailsAsync(q => q.Messages);
            var question = await queryable.FirstOrDefaultAsync(q => q.Messages.Any(m => m.Id == messageId));

            if (question == null) throw new EntityNotFoundException(typeof(Message), messageId);

            if (question.Status == QaStatus.Closed)
                throw new UserFriendlyException("Không thể sửa tin nhắn trong câu hỏi đã đóng.");

            var message = question.Messages.First(m => m.Id == messageId);

            if (message.CreatorId != CurrentUser.Id)
                throw new AbpAuthorizationException("Bạn không có quyền sửa tin nhắn này.");

            message.Content = input.Content;

            await _questionRepository.UpdateAsync(question);

            return ObjectMapper.Map<Message, MessageDto>(message);
        }

        public async Task DeleteMessageAsync(Guid messageId)
        {
            var queryable = await _questionRepository.WithDetailsAsync(q => q.Messages);
            var question = await queryable.FirstOrDefaultAsync(q => q.Messages.Any(m => m.Id == messageId));

            if (question == null) return;

            if (question.Status == QaStatus.Closed)
                throw new UserFriendlyException("Không thể xóa tin nhắn trong câu hỏi đã đóng.");

            var message = question.Messages.First(m => m.Id == messageId);

            
            if (message.CreatorId != CurrentUser.Id && !CurrentUser.IsInRole(Roles.Admin))
            {
                throw new AbpAuthorizationException("Bạn không có quyền xóa tin nhắn này.");
            }

            question.Messages.Remove(message);
            await _questionRepository.UpdateAsync(question);
        }
    }
}
