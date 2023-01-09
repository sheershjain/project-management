pipeline {
    agent {
        label "slave1"
    }
    parameters {
        string(name: 'tag', defaultValue: "${env.BUILD_NUMBER}", description: "Here we define the version or tag for our new image")
    }

    stages {
        stage('SCM') {
            steps {
                echo "PULL CODE FROM GITHUB"
                cleanWs()
                checkout(
                    [$class: 'GitSCM', 
                    branches: [[name: '*/sheersh']], 
                    extensions: [], 
                    userRemoteConfigs: [
                        [url: 'https://github.com/sheershjain/project-management.git']
                        ]
                    ])
            }
        }

        // stage('Building our image') { 
        //     steps { 
        //         script { 
        //             dockerImage = docker.build registry + ":${tag}" 
        //         }
        //         slackSend message: "Build Completed, Image name -> sheersh/arvind:${tag}"
		// 		mail bcc: '', body: "Build is completed. Image name -> sheersh/arvind:${tag}", cc: 'riya@gkmit.co', from: '', replyTo: '', subject: 'Build successful', to: 'arvind@gkmit.co'
        //         sh 'curl -s -X POST https://api.telegram.org/bot5957608414:AAFRgQCY6rjbOUdsfiNgtQ03-euDDgBevQk/sendMessage -d chat_id=-1001461072821 -d parse_mode="HTML" -d text="Build Successfull. Image name -> sheersh/arvind:${tag}"'
        //     } 
        // }
        stage('Created Artifact & Build Image') {
            steps {
                slackSend message: "Build Started ${tag}"
                sh '''
				docker build -t sheersh/arvind:${tag} .
                if [ $(docker images -f "dangling=true" -q) != "" ];
                    then
                        docker rmi $(docker images -f "dangling=true" -q)
                fi
				'''
                slackSend message: "Build Completed, Image name -> sheersh/arvind:${tag}"
				mail bcc: '', body: "Build is completed. Image name -> sheersh/arvind:${tag}", cc: 'riya@gkmit.co', from: '', replyTo: '', subject: 'Build successful', to: 'arvind@gkmit.co'
                sh 'curl -s -X POST https://api.telegram.org/bot5957608414:AAFRgQCY6rjbOUdsfiNgtQ03-euDDgBevQk/sendMessage -d chat_id=-1001461072821 -d parse_mode="HTML" -d text="Build Successfull. Image name -> sheersh/arvind:${tag}"'
            }
        }
        stage('Push image to dockerhub') {
            steps {
                withCredentials([string(credentialsId: 'f6dbd8af-8a0f-40ee-932d-181fd4e16047', variable: 'DOCKER_HUB_PASS')]) {
                    sh "docker login -u sheersh -p $DOCKER_HUB_PASS"
                }
                slackSend message: "Pushed image -> sheersh/arvind:${tag} to Docker Hub"
				sh "docker push sheersh/arvind:${tag}"
                sh "docker rmi -f sheersh/arvind:${tag}"
                mail bcc: '', body: 'New Build image is pushed to Docker HUb', cc: 'riya@gkmit.co', from: '', replyTo: '', subject: 'Image pushed successful', to: 'arvind@gkmit.co'
                sh 'curl -s -X POST https://api.telegram.org/bot5957608414:AAFRgQCY6rjbOUdsfiNgtQ03-euDDgBevQk/sendMessage -d chat_id=-1001461072821 -d parse_mode="HTML" -d text="Image pushed to Docker HUB"'
            }
        }

        stage('Deploy webapp in DEV environment') {
            steps {
                sh "docker pull sheersh/arvind:${tag}"


                sh '''
                if [ $(docker images arvind:latest) != "" ];
                    then
                        docker rmi -f arvind:latest
                fi
                '''
                sh "docker tag sheersh/arvind:${tag} arvind:latest"
                sh '''
                if [ $(docker ps -q) != "" ];
                    then
                        docker-compose -f /home/ec2-user/arvind/docker-compose.yml restart app
                else
                    docker-compose -f /home/ec2-user/arvind/docker-compose.yml up -d
                fi
                '''
                
                slackSend message: "Backend deployed in Dev Environment Successfully at http://13.233.21.134:3010/ with image sheersh/arvind:${tag} "
                mail bcc: '', body: "Backend deployed in Dev Environment Successfully at http://13.233.21.134:3010/ with image sheersh/arvind:${tag}", cc: 'riya@gkmit.co', from: '', replyTo: '', subject: 'Deploy in DEV', to: 'arvind@gkmit.co'
                sh 'curl -s -X POST https://api.telegram.org/bot5957608414:AAFRgQCY6rjbOUdsfiNgtQ03-euDDgBevQk/sendMessage -d chat_id=-1001461072821 -d parse_mode="HTML" -d text="Backend deployed in Dev Environment Successfully at http://13.233.21.134:3010/ with image sheersh/arvind:${tag}"'
				sh "docker rmi -f sheersh/arvind:${tag}"
            }
        }   
    }
    post{
		success{
			slackSend message: "Pipeline run successfull"
		}
		failure{
			sendMessage message:"Kuch tho fata hai"
		}
	}
}




