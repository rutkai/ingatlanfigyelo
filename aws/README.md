# Ingatlanfigyelo CDK infrastructure for AWS

## Stacks

This project is composed of 3 stacks:

1. Pipeline stack: contains the pipeline definition which updates the application stack
2. Shared infra stack: contains the shared infrastructure resources (e.g. VPC, S3 buckets, etc.)
3. Infra stack: contains the application infrastructure resources (e.g. ECS cluster, ECS service, etc.)

## Useful commands

The `cdk.json` file tells the CDK Toolkit how to execute your app.

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template
