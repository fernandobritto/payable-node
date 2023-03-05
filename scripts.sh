#!/bin/bash
set -e

case "$1" in
  test)
    export DEBUG=gb:*
    export NODE_ENV=test
    jest --coverage --forceExit
  ;;
  build)
    echo 'Building...'
    rm -rf dist-*

    npm ci
    serverless package --package dist-${NODE_ENV} --stage ${NODE_ENV} --region us-east-1
  ;;
  sonar)
    PACKAGE_VERSION=$(cat package.json \
      | grep version \
      | head -1 \
      | awk -F: '{ print $2 }' \
      | sed 's/[",]//g' \
      | tr -d '[[:space:]]')
    echo "Extracted version: ${PACKAGE_VERSION}"

    REPLACE='^sonar.projectVersion=.*$'
    WITH="sonar.projectVersion=${PACKAGE_VERSION}"
    sed -i.bak "s#${REPLACE}#${WITH}#g" sonar-project.properties

    git add sonar-project.properties
    git commit -am "release: bump sonar"
  ;;
  dev)
    NODE_PATH=.
    DEBUG=gb:*
    SLS_DEBUG=true

    sls dynamodb install --stage dev --region sa-east-1
    sls offline start --stage dev --region sa-east-1 ${@: 2}
  ;;
  dns-aws-profile)
    export AWS_REGION=${AWS_REGION:=us-east-1}

    cat > $AWS_CONFIG_FILE <<EOF
[default]
aws_access_key_id=$AWS_ACCESS_KEY_ID
aws_secret_access_key=$AWS_SECRET_ACCESS_KEY
aws_session_token=$AWS_SESSION_TOKEN
region=$AWS_REGION

[profile dns]
aws_access_key_id=$DNS_AWS_ACCESS_KEY_ID
aws_secret_access_key=$DNS_AWS_SECRET_ACCESS_KEY
aws_session_token=$DNS_AWS_SESSION_TOKEN
region=$AWS_REGION
EOF
  ;;
  *)
    echo "Usage: {test|build|sonar|dev|deploy:hml|dns-aws-profile}"
    exit 1
  ;;
esac
