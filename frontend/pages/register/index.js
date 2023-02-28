import Head from "next/head";
import { useRef, useState, useEffect } from "react";
import { useContract, useAccount, useSigner } from "wagmi";
import { EmployeeStreamABI, EmployeeStreamContract } from "@/constants";
import Radio from "@mui/material/Radio";

const Register = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [company, setCompany] = useState("");
  const [selectedValue, setSelectedValue] = useState("");
  const [employerData, setEmployerData] = useState("");
  const { data: signer } = useSigner();
  const account = useAccount();

  const contract = useContract({
    address: EmployeeStreamContract,
    abi: EmployeeStreamABI,
    signerOrProvider: signer,
  });

  useEffect(() => {
    if (account.address && signer) {
      (async function () {
        const data = await contract?.employerOfCompany(account.address);
        console.log(data);

        if (data) {
          const employer = await contract?.getEmployerByCompanyName(data);
          console.log(employer);

          if (employer) {
            setEmployerData(employer);
          }
        }
      })();
    }
  }, [account.address, contract]);

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const registerHandler = async (event) => {
    event.preventDefault();

    if (selectedValue === "employee") {
      await contract?.registerEmployee(address, name, company);
    } else if (selectedValue === "employer") {
      await contract?.registerEmployer(name, company);
    }
  };

  return (
    <>
      <Head>
        <title>FluidPay</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-[85vh] bg-[#DFECF1]">
        <form
          onSubmit={registerHandler}
          className="flex flex-col font-Poppins w-[750px] bg-[#D0E1E9] shadow-2xl rounded-2xl p-10 mx-auto  mt-28"
        >
          <label htmlFor="name" className=" font-semibold text-lg mb-1">
            Name
          </label>
          <input
            required
            // ref={enteredName}
            id="name"
            className="border py-3 px-2 rounded-md bg-gray-200 mb-7"
            placeholder="John Doe"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />

          <label htmlFor="add" className=" font-semibold text-lg mb-1">
            Address
          </label>
          <input
            // ref={enteredAddress}
            required
            className="border py-3 px-2 rounded-md bg-gray-200 mb-7"
            id="add"
            value={address}
            placeholder="0x00000000000000000"
            onChange={(e) => {
              setAddress(e.target.value);
            }}
          />

          <div className="flex justify-around gap-4 font-semibold text-lg mb-7">
            <label
              htmlFor="employee"
              className="flex gap-1 items-center cursor-pointer  hover:bg-gray-300 py-4 pl-2 bg-gray-200 text-black  w-full rounded-md "
            >
              <Radio
                checked={selectedValue === "employee"}
                onChange={handleChange}
                value="employee"
                name="radio-buttons"
                inputProps={{ "aria-label": "employee" }}
              />
              <p>Employee</p>
            </label>

            <label
              htmlFor="employer"
              className="flex gap-1 cursor-pointer items-center hover:bg-gray-300 py-4 bg-gray-200 text-black  pl-2 w-full rounded-md "
            >
              <Radio
                checked={selectedValue === "employer"}
                onChange={handleChange}
                value="employer"
                name="radio-buttons"
                inputProps={{ "aria-label": "employer" }}
              />
              <p>Employer</p>
            </label>
          </div>

          <label htmlFor="company" className="font-semibold text-lg mb-1">
            Company Name
          </label>
          <input
            // ref={enteredCompany}
            className="border py-3 px-2 rounded-md bg-gray-200 mb-7"
            id="company"
            required
            value={company}
            placeholder="Space DAO"
            onChange={(e) => {
              setCompany(e.target.value);
            }}
          />

          <button
            type="submit"
            className="bg-[#1e1e1e] py-3 uppercase tracking-wider  text-white font-semibold text-lg rounded-lg hover:bg-[black]"
          >
            Submit
          </button>
        </form>
      </main>
    </>
  );
};

export default Register;