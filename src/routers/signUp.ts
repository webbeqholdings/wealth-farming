import { PayloadRequest } from 'payload';
import { getPayload } from 'payload'
import config from '@payload-config';

const signUp = async (req: PayloadRequest) => {
    try {
        const request = await req.json();
        const payload = await getPayload({
            config,
        });

        const user = await payload.create({
            collection: 'users', // required
            data: {
                role: "individual",
                first_name: request.first_name,
                last_name: request.last_name,
                email: request.email,
                password: request.password,
            },
        })
        const accountTypes = ['personal investment', 'business investment', 'capital'];
        //Create accounts associated with this user
            await Promise.all(accountTypes.map(type =>
                req.payload.create({
                    collection: 'accounts',
                    data: {
                        user: user.id,
                        account_name: type,
                        account_number: Math.floor(Math.random() * 1000000),
                    }
                })
            ));

            return new Response(
                JSON.stringify({
                    data: user,
                    response: 'Create User Successfully',
                })
            );
        } catch (error) {
            const errorBody = { error: 'Internal server error' };
            return new Response(
                JSON.stringify({
                    response: errorBody,
                }),
                {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
        }
    };

    export default {
        path: '/sign-up',
        method: 'post' as const,
        handler: signUp,
    };
