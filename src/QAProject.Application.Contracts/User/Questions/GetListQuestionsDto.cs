using QAProject.Questions;
using Volo.Abp.Application.Dtos;

namespace QAProject.User.Questions;

public class GetListQuestionsDto : PagedAndSortedResultRequestDto
{
    public string? Q { get; set; }
    public QaStatus? Status { get; set; }
}