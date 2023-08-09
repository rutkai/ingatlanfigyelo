import {Construct} from 'constructs';
import {Secret} from "aws-cdk-lib/aws-secretsmanager";
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as codepipeline from "aws-cdk-lib/aws-codepipeline";
import * as codepipeline_actions from "aws-cdk-lib/aws-codepipeline-actions";
import * as codebuild from "aws-cdk-lib/aws-codebuild";

export class FrontendPipeline extends Construct {
  constructor(scope: Construct, id: string, artifactBucket: s3.Bucket) {
    super(scope, id);

    const frontendBuildProject = new codebuild.PipelineProject(this, 'FrontendBuildProject', {
      projectName: 'ingatlanfigyelo-frontend-build',
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_7_0,
        privileged: true,
      },
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          build: {
            commands: [
              "docker run --rm -v $(pwd):/app node:16 bash -c 'cd /app/frontend && npm ci && npm run build-prod'",
              "export ARTIFACT_NAME=\"ingatlanfigyelo-frontend-$CODEBUILD_SOURCE_BRANCH-$CODEBUILD_BUILD_NUMBER-$(date +\"%Y-%m-%d_%H-%M-%S\").tar.gz\"",
              "tar czvf $ARTIFACT_NAME -C public/ .",
              `aws s3 cp $ARTIFACT_NAME s3://${artifactBucket.bucketName}/$CODEBUILD_SOURCE_BRANCH/`,
              `if [ "$CODEBUILD_SOURCE_BRANCH" == "master" ]; then aws s3 cp $ARTIFACT_NAME s3://${artifactBucket.bucketName}/latest-master.tar.gz; fi`,
            ],
          }
        }
      })
    });
    artifactBucket.grantReadWrite(frontendBuildProject);

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
      actionName: 'BuildAndStoreFrontend',
      project: frontendBuildProject,
      input: sourceOutput,
      outputs: [new codepipeline.Artifact()],
    });

    const pipeline = new codepipeline.Pipeline(this, 'FrontendPipeline', {
      pipelineName: 'IngatlanfigyeloFrontendPipeline',
      stages: [
        {
          stageName: 'Source',
          actions: [sourceAction],
        },
        {
          stageName: 'BuildAndStore',
          actions: [buildAction],
        }
      ]
    });
  }
}
