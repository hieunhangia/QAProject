using QAProject.Samples;
using Xunit;

namespace QAProject.EntityFrameworkCore.Domains;

[Collection(QAProjectTestConsts.CollectionDefinitionName)]
public class EfCoreSampleDomainTests : SampleDomainTests<QAProjectEntityFrameworkCoreTestModule>
{

}
