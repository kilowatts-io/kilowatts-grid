

export const log = {
    debug: (msg: string) => {},
    info: (msg: string) => console.log(msg),
    error: (msg: string) => console.error(msg),
}

export default log