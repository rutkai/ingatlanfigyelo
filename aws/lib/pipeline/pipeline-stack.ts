import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {CodePipeline, CodePipelineSource, ShellStep} from "aws-cdk-lib/pipelines";
import {SharedInfraStage} from "../shared-infra/shared-infra-stage";
import {InfraStage} from "../infra/infra-stage";
import {Secret} from "aws-cdk-lib/aws-secretsmanager";
import {SecretValue} from "aws-cdk-lib";

export class PipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, 'Pipeline', {
      pipelineName: 'IngatlanfigyeloPipeline',
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.connection('rutkai/ingatlanfigyelo', 'master', {
          connectionArn: Secret.fromSecretNameV2(this, 'GitHubConnectionArn', 'pipeline/codestar-arn').secretValue.unsafeUnwrap(),
        }),
        commands: ['cd aws', 'npm run build', 'npx cdk synth --all'],
      }),
    });

    pipeline.addStage(new SharedInfraStage(this, 'SharedInfra', {
      env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION,
      },
    }));
    pipeline.addStage(new InfraStage(this, 'Infra', {
      env: {
        account: process.env.CDK_DEFAULT_ACCOUNT,
        region: process.env.CDK_DEFAULT_REGION,
      },
    }));
  }
}
