exports.default = async function (configuration) {
    const file = configuration.path;
    const certFile = process.env.WINDOWS_SIGN_CERT_FILE;
    const keyFile = process.env.WINDOWS_SIGN_KEY_FILE;
    const keyPass = process.env.WINDOWS_SIGN_KEY_PASS;

    require("child_process").execSync(
        `java8 -jar jsign-2.1.jar --certfile "${certFile}" --keyfile "${keyFile}" --keypass "${keyPass}" --tsaurl http://timestamp.comodoca.com/authenticode "${file}"`,
        {
            stdio: "inherit"
        }
    );
};