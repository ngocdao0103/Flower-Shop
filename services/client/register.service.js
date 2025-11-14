export class Register{
    id;
    constructor(){

    }

    register(name, email, phone, address, password) {
        axios.post("http://localhost:3000/users", {
            name: name,
            email: email,
            phone: phone,
            address: address,
            password: password,
            role: "costomer"
        }).then(response => {
            console.log(response);
            alert ("Đăng kí thành công!");
        }).catch(error => console.error(error));
    }
}