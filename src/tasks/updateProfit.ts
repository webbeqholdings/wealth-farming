import type { TaskHandler } from 'payload';
import { getPayload } from 'payload';
import config from '@payload-config';

export const updateProfitHandler: TaskHandler<{
    input: {};
    output: { postID: string };
}> = async ({ input, job, req }) => {
    console.log('vo cronjob');
    const payload = await getPayload({
        config,
    });

    const createdJob = await payload.jobs.queue({
        task: 'updateProfit',
        input: {
          title: 'my title',
        },
    })

    return {
        output: {
            postID: String(createdJob.id), // Ensure postID is a string
        },
    };
};
