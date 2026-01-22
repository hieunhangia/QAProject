using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QAProject.Migrations
{
    /// <inheritdoc />
    public partial class UpdateNavigationProperties : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_AppComments_CreatorId",
                table: "AppComments",
                column: "CreatorId");

            migrationBuilder.AddForeignKey(
                name: "FK_AppComments_AbpUsers_CreatorId",
                table: "AppComments",
                column: "CreatorId",
                principalTable: "AbpUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AppComments_AbpUsers_CreatorId",
                table: "AppComments");

            migrationBuilder.DropIndex(
                name: "IX_AppComments_CreatorId",
                table: "AppComments");
        }
    }
}
