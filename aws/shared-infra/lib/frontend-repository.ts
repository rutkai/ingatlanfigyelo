import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';

export class FrontendRepository extends Construct {
  public readonly frontendRepo: s3.Bucket;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.frontendRepo = new s3.Bucket(this, 'FrontendRepository', {
      bucketName: 'ingatlanfigyelo-frontend-artifacts',
    });

    new cdk.CfnOutput(this, 'frontend-bucket-name', {
      value: this.frontendRepo.bucketName,
    });
  }
}
