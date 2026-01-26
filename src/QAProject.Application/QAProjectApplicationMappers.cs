using QAProject.BA.Questions;
using QAProject.Questions;
using QAProject.User.Assignees;
using QAProject.User.Questions;
using Riok.Mapperly.Abstractions;
using Volo.Abp.Identity;
using Volo.Abp.Mapperly;

namespace QAProject;

/*
 * You can add your own mappings here.
 * [Mapper(RequiredMappingStrategy = RequiredMappingStrategy.Target)]
 * public partial class QAProjectApplicationMappers : MapperBase<BookDto, CreateUpdateBookDto>
 * {
 *    public override partial CreateUpdateBookDto Map(BookDto source);
 * 
 *    public override partial void Map(BookDto source, CreateUpdateBookDto destination);
 * }
 */
[Mapper]
public partial class QuestionToQuestionSummaryDtoMapper : MapperBase<Question, QuestionSummaryDto>
{
    public override partial QuestionSummaryDto Map(Question source);
    public override partial void Map(Question source, QuestionSummaryDto destination);
}

[Mapper]
public partial class QuestionToQuestionDetailDtoMapper : MapperBase<Question, QuestionDetailDto>
{
    public override partial QuestionDetailDto Map(Question source);
    public override partial void Map(Question source, QuestionDetailDto destination);
    private partial MessageDto MapMessageToDto(Message source);
}

[Mapper]
public partial class CreateQuestionDtoToQuestionMapper : MapperBase<CreateQuestionDto, Question>
{
    public override partial Question Map(CreateQuestionDto source);
    public override partial void Map(CreateQuestionDto source, Question destination);
}

[Mapper]
public partial class UpdateQuestionDtoToQuestionMapper : MapperBase<UpdateQuestionDto, Question>
{
    public override partial Question Map(UpdateQuestionDto source);
    public override partial void Map(UpdateQuestionDto source, Question destination);
}

[Mapper]
public partial class AssigneeToAssigneeDtoMapper : MapperBase<IdentityUser, AssigneeDto>
{
    public override partial AssigneeDto Map(IdentityUser source);
    public override partial void Map(IdentityUser source, AssigneeDto destination);
}

[Mapper]
public partial class QuestionToQuestionDtoMapper
    : MapperBase<Question, QuestionDto>
{
    public override partial QuestionDto Map(Question source);
    public override partial void Map(Question source, QuestionDto destination);
}

[Mapper]
public partial class MessageToMessageDtoMapper : MapperBase<Message, MessageDto>
{
    public override partial MessageDto Map(Message source);

    public override partial void Map(Message source, MessageDto destination);
}