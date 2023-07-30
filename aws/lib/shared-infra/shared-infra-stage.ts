import * as cdk from 'aws-cdk-lib';
import { Construct } from "constructs";
import { SharedInfraStack } from './shared-infra-stack';

export class SharedInfraStage extends cdk.Stage {

  constructor(scope: Construct, id: string, props?: cdk.StageProps) {
    super(scope, id, props);

    const sharedInfraStack = new SharedInfraStack(this, 'SharedInfraStack');
  }
}
