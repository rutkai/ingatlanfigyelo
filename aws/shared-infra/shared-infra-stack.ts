import * as cdk from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {Network} from "./lib/network";
import {AppRepository} from "./lib/app-repository";

export class SharedInfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const network = new Network(this, 'ingatlanfigyelo-vpc');
    const repo = new AppRepository(this, 'ingatlanfigyelo-apprepo');

    cdk.Tags.of(this).add('project', 'ingatlanfigyelo-shared-infra');
  }
}
