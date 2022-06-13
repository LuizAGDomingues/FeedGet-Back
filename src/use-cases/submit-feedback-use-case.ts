import { MailAdapter } from "../adapters/mail-adapter";
import { FeedbackRepository } from "../repositories/feedbacks-repository";

interface SubmitFeedbackUseCaseRequest {
    type: string;
    comment: string;
    screenshot?: string;
}

export class SubmitFeedbackUseCase {
    constructor(
        private feedbacksRepository: FeedbackRepository,
        private mailAdapter: MailAdapter,
    ) {}
    async execute(request: SubmitFeedbackUseCaseRequest) {
        const { type, comment, screenshot } = request;
        await this.feedbacksRepository.create({
            type,
            comment,
            screenshot
        })
        await this.mailAdapter.sendMail({
            subject: 'Novo feedback',
            body: [
                `<div style='font-family: sand-serif; font-size: 16px; color: #111;'>`,
                `<p>Tipo do feedback: ${type}</p>`,
                `<p>Comentário do feedback: ${comment}</p>`,
                screenshot ? `<img src="${screenshot}" />` : ``,
                `</div>`,
            ].join('\n')
        })
    }
}