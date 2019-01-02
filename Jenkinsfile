pipeline {
    agent {
        docker { image 'damitj07/node-docker-aws:2' }
    }
    environment { 
        CI = 'true'
        VERSION = "${env.BUILD_ID}-${env.GIT_COMMIT}"
        CATTLE_ACCESS_KEY =  credentials('jenkins-rancher-access-key')
        CATTLE_SECRET_KEY =  credentials('jenkins-rancher-secret-key')
        NAME = "apigateway"
        SCALE= 1
        IMAGE_REPO = "714125394997.dkr.ecr.ap-south-1.amazonaws.com"
        GIT_URI = "git@bitbucket.org:ayopop/apigateway.git"
        BRANCH = "${env.BRANCH_NAME}"
    }
    stages {
        stage('Build') {
            steps {
                echo "Running ${VERSION} on ${env.JENKINS_URL}"
                git branch: "${BRANCH}", credentialsId: 'jenkins-bitbucket-key', url: "${GIT_URI}"
                echo "for brnach ${env.BRANCH_NAME}"
                sh "docker build -t ${NAME} ."
                sh "docker tag ${NAME}:latest ${IMAGE_REPO}/${NAME}:${VERSION}"
            }
        }
        stage('Test') {
            steps {
                echo 'Skipping Testing..'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying.. To Dev'
                sh 'aws ecr get-login --no-include-email --region ap-south-1 >> login.sh'
                sh 'sh login.sh'
                sh "docker push ${IMAGE_REPO}/${NAME}:${VERSION}"
                sh 'sh .docker/workload-update.sh'
            }
        }
    }
}