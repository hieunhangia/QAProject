using QAProject.Samples;
using Xunit;

namespace QAProject.EntityFrameworkCore.Applications;

[Collection(QAProjectTestConsts.CollectionDefinitionName)]
public class EfCoreSampleAppServiceTests : SampleAppServiceTests<QAProjectEntityFrameworkCoreTestModule>
{

}
