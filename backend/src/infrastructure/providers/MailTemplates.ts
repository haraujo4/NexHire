export class MailTemplates {
    private static baseStyles = `
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f9f9f9; }
        .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05); }
        .header { background: linear-gradient(135deg, #2563eb 0%, #4f46e5 100%); padding: 32px; text-align: center; color: white; }
        .content { padding: 32px; }
        .footer { padding: 24px; text-align: center; font-size: 12px; color: #94a3b8; background: #f8fafc; }
        .button { display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 16px; }
        .status-badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 14px; font-weight: 500; background: #e0f2fe; color: #0369a1; }
    `;

    static welcomeCandidate(name: string): string {
        return `
            <html>
                <head><style>${this.baseStyles}</style></head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Bem-vindo ao NexHire!</h1>
                        </div>
                        <div class="content">
                            <p>Olá, <strong>${name}</strong>!</p>
                            <p>Parabéns por se juntar à plataforma mais inteligente de recrutamento.</p>
                            <p>Agora você pode completar seu perfil, subir seu CV e deixar nossa IA te conectar com as melhores oportunidades do mercado.</p>
                            <center><a href="http://localhost:5173/candidate/profile" class="button">Completar Perfil</a></center>
                        </div>
                        <div class="footer">
                            © 2026 NexHire - Recrutamento inteligente para a era Digital
                        </div>
                    </div>
                </body>
            </html>
        `;
    }

    static welcomeCompany(name: string): string {
        return `
            <html>
                <head><style>${this.baseStyles}</style></head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Sua jornada no NexHire começa agora!</h1>
                        </div>
                        <div class="content">
                            <p>Olá, <strong>${name}</strong>!</p>
                            <p>Estamos entusiasmados em ajudar sua empresa a encontrar os melhores talentos.</p>
                            <p>Comece publicando sua primeira vaga e deixe nossa tecnologia de análise por IA encontrar os candidatos ideais.</p>
                            <center><a href="http://localhost:5173/company/dashboard" class="button">Acessar Dashboard</a></center>
                        </div>
                        <div class="footer">
                            © 2026 NexHire - Recrutamento inteligente para a era Digital
                        </div>
                    </div>
                </body>
            </html>
        `;
    }

    static applicationConfirmation(candidateName: string, jobTitle: string, companyName: string): string {
        return `
            <html>
                <head><style>${this.baseStyles}</style></head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Inscrição Recebida!</h1>
                        </div>
                        <div class="content">
                            <p>Olá, <strong>${candidateName}</strong>!</p>
                            <p>Sua candidatura para a vaga de <strong>${jobTitle}</strong> na <strong>${companyName}</strong> foi enviada com sucesso.</p>
                            <p>O recrutador será notificado e você poderá acompanhar o status pelo seu painel.</p>
                            <center><a href="http://localhost:5173/candidate/jobs" class="button">Ver Meus Processos</a></center>
                        </div>
                        <div class="footer">
                            © 2026 NexHire - Recrutamento inteligente para a era Digital
                        </div>
                    </div>
                </body>
            </html>
        `;
    }

    static statusUpdate(candidateName: string, jobTitle: string, newStatus: string): string {
        return `
            <html>
                <head><style>${this.baseStyles}</style></head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Atualização no seu Processo</h1>
                        </div>
                        <div class="content">
                            <p>Olá, <strong>${candidateName}</strong>!</p>
                            <p>Houve uma atualização no seu processo seletivo para a vaga <strong>${jobTitle}</strong>.</p>
                            <p>Novo Status: <span class="status-badge">${newStatus}</span></p>
                            <p>Acesse a plataforma para ver mais detalhes sobre os próximos passos.</p>
                            <center><a href="http://localhost:5173/candidate/jobs" class="button">Ver Detalhes</a></center>
                        </div>
                        <div class="footer">
                            © 2026 NexHire - Recrutamento inteligente para a era Digital
                        </div>
                    </div>
                </body>
            </html>
        `;
    }
}
