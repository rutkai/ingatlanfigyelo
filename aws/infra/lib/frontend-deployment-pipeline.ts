import {Construct} from 'constructs';
import {Secret} from "aws-cdk-lib/aws-secretsmanager";
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as codepipeline from "aws-cdk-lib/aws-codepipeline";
import * as codepipeline_actions from "aws-cdk-lib/aws-codepipeline-actions";
import * as codebuild from "aws-cdk-lib/aws-codebuild";

export class FrontendDeploymentPipeline extends Construct {
  constructor(scope: Construct, id: string, deployTarget: s3.Bucket) {
    super(scope, id);

    const artifactBucket = s3.Bucket.fromBucketName(this, 'FrontendArtifactBucket', 'ingatlanfigyelo-frontend-artifacts')
    const sourceOutput = new codepipeline.Artifact();
    const sourceAction = new codepipeline_actions.S3SourceAction({
      actionName: 'SourceArtifact',
      bucket: artifactBucket,
      bucketKey: 'ingatlanfigyelo-frontend-master-latest.tar.gz',
      output: sourceOutput,
    });

    const deployAction = new codepipeline_actions.S3DeployAction({
      actionName: 'Deploy',
      input: sourceOutput,
      bucket: deployTarget,
      extract: true,
    });

    const pipeline = new codepipeline.Pipeline(this, 'FrontendDeployPipeline', {
      pipelineName: 'IngatlanfigyeloFrontendDeployPipeline',
      stages: [
        {
          stageName: 'Source',
          actions: [sourceAction],
        },
        {
          stageName: 'Deploy',
          actions: [deployAction],
        }
      ]
    });
  }
}
