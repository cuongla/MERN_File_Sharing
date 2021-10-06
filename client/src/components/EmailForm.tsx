import React, { FC, useState } from 'react';
import Button from '@components/Reusable/Button'
import axios from 'axios';


const EmailForm: FC<{ id: string }> = ({ id }) => {
    const [emailFrom, setEmailFrom] = useState("");
    const [emailTo, setEmailTo] = useState("");
    const [message, setMessage] = useState(null);

    const submitEmail = async (e) => {
        e.preventDefault();

        try {
            const { data } = await axios({
                method: "POST",
                url: "api/files/email",
                data: {
                    id,
                    emailFrom,
                    emailTo
                }
            });
            //@ts-ignore
            setMessage(data.message);
        } catch (error) {
            console.log(error);
            // setMessage(error.data.response.message);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center w-full p-2 space-y-3">
            <h3>You cansend the file through email</h3>
            <form
                onSubmit={submitEmail}
                className="flex flex-col items-center justify-center w-full p-2 space-y-3">
                <input
                    type="email"
                    placeholder="Email From"
                    required
                    className="p-1 text0white bg-gray-800 border-2 focus:outline-none"
                    onChange={e => setEmailFrom(e.target.value)}
                    value={emailFrom} />
                <input
                    type="email"
                    placeholder="Email To"
                    required
                    className="p-1 text0white bg-gray-800 border-2 focus:outline-none"
                    onChange={e => setEmailTo(e.target.value)}
                    value={emailTo} />
                <Button
                    text="Send Email"
                    type="submit" />
            </form>
            {
                message && <p className="font-medium text-red-500">{message}</p>
            }
        </div>
    )
}

export default EmailForm
