import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {FrontendRepository} from './lib/frontend-repository';

export class InfraStack extends cdk.Stack {
  public static readonly STACK_NAME = 'ingatlanfigyelo-infra';

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, {
      ...props,
      stackName: InfraStack.STACK_NAME,
    });

    const frontendRepo = new FrontendRepository(this, 'ingatlanfigyelo-frontendrepo');

    cdk.Tags.of(this).add('project', InfraStack.STACK_NAME);
  }
}
