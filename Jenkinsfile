pipeline {
    agent none
    options {
        office365ConnectorWebhooks([
            [name: 'Office 365', url: 'https://cloudstakes.webhook.office.com/webhookb2/8b57b140-6fc3-4cdc-adec-372e32987450@42ff0047-d84e-4655-aa6b-5c653894fe10/IncomingWebhook/536549507d9d4d1da5dd169205324404/c7d437c0-e376-447a-b7fd-afaaef0638cd', notifyBackToNormal: false, notifyFailure: true, notifyRepeatedFailure: true, notifySuccess: true, notifyAborted: true]
        ])
    }
    environment {
        ACR_SERVER = 'ftmfrontend.azurecr.io'  
        ACR_CREDENTIALS = credentials('azure_secret')  // Azure credentials ID
        DOCKER_IMAGE = 'ftmfrontend:latest' 
    }

    stages {
        stage('Create Docker Image') {
            agent {
                label 'master'
            }
            steps {
                script {
                    // Build the Docker image
                    sh "docker build -t ${DOCKER_IMAGE} ."
                }
            }
        }
          stage('Docker Image Tag') {
            agent {
                label 'master'
            }
            steps {
                script {
                    // Build the Docker image
                    sh "docker tag ${DOCKER_IMAGE} ftmfrontend.azurecr.io/ftmfrontend:latest"
                }
            }
        }

        stage('Push to ACR') {
            agent {
                label 'master'
            }
            steps {
                script {
                    // Authenticate with Azure Container Registry using Azure credentials
                    withCredentials([azureServicePrincipal(credentialsId: 'azure_secret', usePrincipal: true)]) {
                        // Log in to Azure
                        sh "az login --service-principal -u \${AZURE_CLIENT_ID} -p \${AZURE_CLIENT_SECRET} --tenant \${AZURE_TENANT_ID}"
                        
                        // Log in to ACR
                        sh "az acr login --name ${ACR_SERVER}"
                        
                        // Push the Docker image to ACR
                        sh "docker push ${ACR_SERVER}/${DOCKER_IMAGE}"
                    }
                }
            }
        }
            stage('Docker Image Pull') {
            agent {
                label 'vps'
            }
            steps {
                script {
                    withCredentials([azureServicePrincipal(credentialsId: 'azure_secret', usePrincipal: true)]) {
                        // Log in to Azure
                        sh "az login --service-principal -u \${AZURE_CLIENT_ID} -p \${AZURE_CLIENT_SECRET} --tenant \${AZURE_TENANT_ID}"
                        
                        // Log in to ACR
                        sh "az acr login --name ${ACR_SERVER}"
                        
                        // Push the Docker image to ACR
                        sh "docker pull ${ACR_SERVER}/${DOCKER_IMAGE}"

                        sh "docker stop ftm_frontend"

                        sh "docker rm ftm_frontend"

                        sh "docker run -d -p 8090:80 --name ftm_frontend ftmfrontend.azurecr.io/ftmfrontend"
                    }
                       
                }
            }
        }
    }
}
