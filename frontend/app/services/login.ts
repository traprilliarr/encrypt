import fetcher from "../axios/axios";

const loginService = async (username: string, password: string) => {
    const resp = await fetcher.post("/api/login", {
        username: username,
        password: password,
    })

    if (resp.status != 200) {
        throw new Error("status is not 200");
    }

    if (!resp.data) {
        throw new Error("empty data");
    }

    return resp.data;
}

export default loginService;