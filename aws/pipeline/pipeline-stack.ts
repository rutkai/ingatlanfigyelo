import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {DeployPipeline} from "./lib/deploy-pipeline";

export class PipelineStack extends cdk.Stack {
  public static readonly STACK_NAME = 'ingatlanfigyelo-pipeline';

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new DeployPipeline(this, 'ingatlanfigyelo-deploy-pipeline');

    cdk.Tags.of(this).add('project', PipelineStack.STACK_NAME);
  }
}
