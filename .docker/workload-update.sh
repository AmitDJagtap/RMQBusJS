# Update deploymet with image tagged

IMAGE="714125394997.dkr.ecr.ap-south-1.amazonaws.com/apigateway:$VERSION"
WORKLOAD_SELCTER="deployment-default-apigateway"
PROJECT_ID="c-8z8xx:project-x8vhj"
NAMESPACE="default"
REGISTRY_SECRET="ap-south-1-ecr-registry"
echo $IMAGE

echo curl -k -u "${CATTLE_ACCESS_KEY}:${CATTLE_SECRET_KEY}" \
-X PUT \
-H 'Accept: application/json' \
-H 'Content-Type: application/json' \
-d '{ "containers": [{ "environmentFrom": [{ "optional": false, "prefix": "", "source": "configMap", "sourceName": "'${NAME}'", "type": "/v3/project/schemas/environmentFrom" }],"image": "'${IMAGE}'", "name": "'${NAME}'" }], "imagePullSecrets": [{ "name": "'${REGISTRY_SECRET}'", "type": "/v3/project/schemas/localObjectReference" }], "name": "'${NAME}'", "namespaceId": "'${NAMESPACE}'", "projectId": "'${PROJECT_ID}'", "scale": "'${SCALE}'", "workloadLabels": { "workload.user.cattle.io/workloadselector": "'${WORKLOAD_SELCTER}'" } }' \
'https://ec2-35-154-209-143.ap-south-1.compute.amazonaws.com/v3/project/'${PROJECT_ID}'/workloads/deployment:'${NAMESPACE}':'${NAME}

 curl -k -u "${CATTLE_ACCESS_KEY}:${CATTLE_SECRET_KEY}" \
-X PUT \
-H 'Accept: application/json' \
-H 'Content-Type: application/json' \
-d '{ "containers": [{ "environmentFrom": [{ "optional": false, "prefix": "", "source": "configMap", "sourceName": "'${NAME}'", "type": "/v3/project/schemas/environmentFrom" }] , "image": "'${IMAGE}'", "name": "'${NAME}'" }], "imagePullSecrets": [{ "name": "'${REGISTRY_SECRET}'", "type": "/v3/project/schemas/localObjectReference" }], "name": "'${NAME}'", "namespaceId": "'${NAMESPACE}'", "projectId": "'${PROJECT_ID}'", "scale": "'${SCALE}'", "workloadLabels": { "workload.user.cattle.io/workloadselector": "'${WORKLOAD_SELCTER}'" } }' \
'https://ec2-35-154-209-143.ap-south-1.compute.amazonaws.com/v3/project/'${PROJECT_ID}'/workloads/deployment:'${NAMESPACE}':'${NAME}