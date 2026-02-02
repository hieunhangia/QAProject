using System.ComponentModel.DataAnnotations;
using Volo.Abp.Application.Dtos;

namespace QAProject.User.Assignees;

public class GetAssigneeDto : LimitedResultRequestDto
{
    public string? AssigneeName { get; set; }
}