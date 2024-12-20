import Link from "next/link"

// show signup success message
const SignupSuccessBox = () => {
    // const router = useRouter();
    return (
    <>
    <div className='flex w-2/3 items-center justify-center'>
        <div className='flex flex-col p-12 w-[34rem] h-[40rem] custom-shadow-border rounded-[50px] items-center justify-center'>
            <p className="text-3xl">Sign up successful</p>
            <Link href={"/"} className="p-button w-fit my-2">Go back to login</Link>
        </div>
    </div>
    </>
  )
}

export default SignupSuccessBox