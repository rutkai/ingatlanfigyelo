import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';

export class AppRepository extends Construct {
  public readonly appRepo: ecr.Repository;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.appRepo = new ecr.Repository(this, 'AppRepository', {
      repositoryName: 'ingatlanfigyelo-app',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      imageScanOnPush: true,
    });

    new cdk.CfnOutput(this, 'appRepositoryUri', {
      value: this.appRepo.repositoryUri,
    });
    new cdk.CfnOutput(this, 'appRepositoryArn', {
      value: this.appRepo.repositoryArn,
    });
  }
}
