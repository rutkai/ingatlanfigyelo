import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {Network} from "./lib/network";
import {AppRepository} from "./lib/app-repository";
import {AppPipeline} from "./lib/app-pipeline";
import {FrontendRepository} from "./lib/frontend-repository";

export class SharedInfraStack extends cdk.Stack {
  public static readonly STACK_NAME = 'ingatlanfigyelo-shared-infra';

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, {
      ...props,
      stackName: SharedInfraStack.STACK_NAME,
    });

    const network = new Network(this, 'ingatlanfigyelo-vpc');
    const repo = new AppRepository(this, 'ingatlanfigyelo-apprepo');
    const frontendRepo = new FrontendRepository(this, 'ingatlanfigyelo-frontendrepo');

    const appPipeline = new AppPipeline(this, 'ingatlanfigyelo-app-pipeline', repo.appRepo)

    cdk.Tags.of(this).add('project', SharedInfraStack.STACK_NAME);
  }
}
