import {Construct} from 'constructs';
import {Secret} from "aws-cdk-lib/aws-secretsmanager";
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as codepipeline from "aws-cdk-lib/aws-codepipeline";
import * as codepipeline_actions from "aws-cdk-lib/aws-codepipeline-actions";
import * as codebuild from "aws-cdk-lib/aws-codebuild";

export class AppPipeline extends Construct {
  constructor(scope: Construct, id: string, ecrRepo: ecr.Repository) {
    super(scope, id);

    const dockerBuildProject = new codebuild.PipelineProject(this, 'AppBuildProject', {
      projectName: 'ingatlanfigyelo-app-docker-build',
      environment: {
        privileged: true,
      },
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          build: {
            commands: [
              `docker build -t ${ecrRepo.repositoryUri}:latest app/`,
              '$(aws ecr get-login --no-include-email --region $AWS_DEFAULT_REGION)',
              `docker push ${ecrRepo.repositoryUri}:latest`,
            ],
          }
        }
      })
    });
    ecrRepo.grantPullPush(dockerBuildProject);

    const sourceOutput = new codepipeline.Artifact();
    const sourceAction = new codepipeline_actions.CodeStarConnectionsSourceAction({
      actionName: 'GitHub',
      owner: 'rutkai',
      repo: 'ingatlanfigyelo',
      branch: 'master',
      output: sourceOutput,
      connectionArn: Secret.fromSecretNameV2(this, 'GitHubConnectionArn', 'pipeline/codestar-arn').secretValue.unsafeUnwrap(),
    });

    const buildAction = new codepipeline_actions.CodeBuildAction({
      actionName: 'BuildAndPushDockerImage',
      project: dockerBuildProject,
      input: sourceOutput,
      outputs: [new codepipeline.Artifact()],
    });

    const pipeline = new codepipeline.Pipeline(this, 'AppPipeline', {
      pipelineName: 'IngatlanfigyeloAppPipeline',
      stages: [
        {
          stageName: 'Source',
          actions: [sourceAction],
        },
        {
          stageName: 'Build',
          actions: [buildAction],
        }
      ]
    });
  }
}
