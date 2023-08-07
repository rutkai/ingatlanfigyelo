import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class InfraStack extends cdk.Stack {
  public static readonly STACK_NAME = 'ingatlanfigyelo-infra';

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, {
      ...props,
      stackName: InfraStack.STACK_NAME,
    });

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'AwsQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });

    cdk.Tags.of(this).add('project', InfraStack.STACK_NAME);
  }
}
