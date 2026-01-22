using System.ComponentModel.DataAnnotations;
using Volo.Abp.Application.Dtos;

namespace QAProject.User.Assignees;

public class GetAssigneeDto : LimitedResultRequestDto
{
    [Required]
    public required string AssigneeName { get; set; }
}