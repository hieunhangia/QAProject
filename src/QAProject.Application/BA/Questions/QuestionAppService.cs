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
using Volo.Abp.Users;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;


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

        public async Task<PagedResultDto<QuestionSummaryDto>> GetListQuestionAsync(GetListQuestionsDto input)
        {
         
            var query = await _questionRepository.GetQueryableAsync();

           
            query = query
                .Include(q => q.Assignee)
                .Include(q => q.LastModifier)
                .Where(x => x.AssigneeId == CurrentUser.Id);

            
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
               
                query = query.OrderBy(input.Sorting ?? $"{nameof(Question.CreationTime)} desc");
                query = query.PageBy(input.SkipCount, input.MaxResultCount);

                var entities = await AsyncExecuter.ToListAsync(query);

              
                entityDtos = ObjectMapper.Map<List<Question>, List<QuestionSummaryDto>>(entities);
            }

            return new PagedResultDto<QuestionSummaryDto>(
                totalCount,
                entityDtos
            );
        }
        public async Task<MessageDto> SendMessageAsync(Guid questionId, CreateUpdateMessageDto input)
        {
           
            var question = await _questionRepository.GetAsync(questionId);

           
            if (question.Status == QaStatus.Closed)
            {
                throw new UserFriendlyException("The conversation is closed. No further messages can be added.");
            }

            if (question.AssigneeId != CurrentUser.Id)
            {
                throw new AbpAuthorizationException("You do not have permission to send messages to this question.");
            }


            question.AddMessage(input.Content);

           
            await _questionRepository.UpdateAsync(question);

          
            var lastMessage = question.Messages.Last();

            return ObjectMapper.Map<Message, MessageDto>(lastMessage);
        }

        public async Task<QuestionDetailDto> GetQuestionDetailAsync(Guid id)
        {
            
            var queryable = await _questionRepository.GetQueryableAsync();

            
            var question = await queryable
                .Include(q => q.Assignee)
                .Include(q => q.Messages)
                    .ThenInclude(m => m.Creator)
                .FirstOrDefaultAsync(q => q.Id == id);

            
            if (question == null)
            {
                throw new EntityNotFoundException(typeof(Question), id);
            }

            
            if (question.AssigneeId != CurrentUser.Id)
            {
                throw new AbpAuthorizationException("You do not have permission to access this question.");
            }

            
            question.Messages = question.Messages.OrderBy(m => m.CreationTime).ToList();

            
            return ObjectMapper.Map<Question, QuestionDetailDto>(question);
        }

        public async Task<MessageDto> UpdateMessageAsync(Guid messageId, CreateUpdateMessageDto input)
        {
           
            var queryable = await _questionRepository.WithDetailsAsync(q => q.Messages);
            var question = await queryable.FirstOrDefaultAsync(q => q.Messages.Any(m => m.Id == messageId));

            if (question == null) throw new EntityNotFoundException(typeof(Message), messageId);

            if (question.Status == QaStatus.Closed)
            {
                throw new UserFriendlyException("The conversation is closed. Messages cannot be edited.");
            }

            var message = question.Messages.First(m => m.Id == messageId);

            if (message.CreatorId != CurrentUser.Id)
                throw new AbpAuthorizationException("You do not have permission to update this message.");
            
            if (message.CreationTime.AddHours(1) < DateTime.Now)
            {
                throw new UserFriendlyException("Messages can only be updated within 1 hour of creation.");
            }

            message.UpdateContent(input.Content);

            await _questionRepository.UpdateAsync(question);

            return ObjectMapper.Map<Message, MessageDto>(message);
        }

       
    }
}
