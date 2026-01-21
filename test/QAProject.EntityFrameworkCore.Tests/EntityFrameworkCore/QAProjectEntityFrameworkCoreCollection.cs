using Xunit;

namespace QAProject.EntityFrameworkCore;

[CollectionDefinition(QAProjectTestConsts.CollectionDefinitionName)]
public class QAProjectEntityFrameworkCoreCollection : ICollectionFixture<QAProjectEntityFrameworkCoreFixture>
{

}
