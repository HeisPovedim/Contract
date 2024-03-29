// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
pragma experimental ABIEncoderV2;

contract preparation {
    
    //Проверка на админа
    modifier onlyAdmin () {
        require(users[msg.sender].role == true, "You are not admin.");     //Ошибка если вы не админ.
        _;
    }
    
    function getHash(string memory str) public pure returns(bytes32) {
        return(keccak256(abi.encodePacked(str)));
    }

    //Структура ЮЗЕРА
    struct user {
        string login;
        string password;
        uint balance;
        bool role;
    }
        mapping (address => user) public users;        //массив юзеров
        address[] public userlist;
        int adminAmount;
        
    constructor () {
        //админы
        users [0x635302E3158503b36F9cd8264f55349aEf2d3294] = user("1", "", 1000, true);
        userlist.push(0x635302E3158503b36F9cd8264f55349aEf2d3294);
        users [0x117A08F4DeB26D78BD177A8AF6c4518bA6A6B449] = user("2", "", 1000, true);
        userlist.push(0x117A08F4DeB26D78BD177A8AF6c4518bA6A6B449);
        users [0xaC73D67c6B0d3698810BB883831BDFeC74CB540f] = user("3", "", 1000, true);
        userlist.push(0xaC73D67c6B0d3698810BB883831BDFeC74CB540f);
        adminAmount = 2;
        //пользователи
        users [0x75ACa741485737a63B4A18DE4B83354F52778a3f] = user("4", "", 1000, false);
        userlist.push(0x75ACa741485737a63B4A18DE4B83354F52778a3f);
        users [0xA38985bE278C2Cc252CC268d9bbaD5E01f6316b3] = user("5", "", 1000, false);
        userlist.push(0xA38985bE278C2Cc252CC268d9bbaD5E01f6316b3);
        users [0x8cBCdaC7EcA288411381FBC9B81cf9170506a80a] = user("6", "", 1000, false);
        userlist.push(0x8cBCdaC7EcA288411381FBC9B81cf9170506a80a);
        users [0xBfb84EA003F217227C428341B1051fC9aF6E82Ea] = user("7", "", 1000, false);
        userlist.push(0xBfb84EA003F217227C428341B1051fC9aF6E82Ea);
        
        //Готовые шаблоны
        patterns["Present 10"] = pattern("Personal Transfer", 10);          //шаблон подарков
        patterns["Present 30"] = pattern("Personal Transfer", 30);          //шаблон подарков
        patterns["Present 50"] = pattern("Personal Transfer", 50);          //шаблон подарков
        patterns["Rent 70"] = pattern("Rent Payment", 70);                  //шаблон кварплаты
        patterns["Rent 90"] = pattern("Rent Payment", 90);                  //шаблон кварплаты
        patterns["Debt Repayment"] = pattern("Personal Settlements", 0);    //шаблон погашения задолжности
        tempPatterns = ["Podarok 10", "Podarok 30", "Podarok 50", "Kvartplata 70", "Kvartplata 90", "Pogashenie zadolzhennosti 100"];
        //Готовые категории
        categories = ["Personal transfer", "Payment of rental housing", "Personal settlements"];
    }
    
    //_____________________________________________________________ФУНКЦИИ СОЗДАНИЯ ПОЛЬЗОВАТЕЛЕЙ_________________________________________________________________________
    //Модификатор проверка того, зарегестрирован ли пользователь
    modifier checkUserLog {      
        bool vote = false;
        for (uint i = 0; i < userlist.length; i++) { 	//смотрим на весь список голосов ЗА и ищем там админа, который пытается проголосовать
            if (userlist[i] == msg.sender) {
                vote = true;
                break;
            }
        }
        require(vote == false, "error: userLogin"); // ошибка, уже проголосовал
        _;
    }
    
    //Функция просмотра логина
    function getUsersLogin (address adr) public view returns(string memory) {
        return(users[adr].login);
    }

    //Функция создания пользователи
    function addUser (string memory login, string memory password) public checkUserLog {
        users[msg.sender]=user(login, password, 1000, false);
        userlist.push(msg.sender);
    }
    //Функция просмотра пользователей
    function viewUsers () public view returns(address[] memory) {
        return(userlist);
    }

    function getBalance(address addr) public view returns(uint) {
        return(addr.balance);
    }
    //_____________________________________________________________ФУНКЦИИ СОЗДАНИЯ ПОЛЬЗОВАТЕЛЕЙ_________________________________________________________________________

    //_____________________________________________________________ФУНКЦИИ ШАБЛОНОВ И КАТЕГОРИЙ___________________________________________________________________________
    //Структура шаблонов
    struct pattern {
        string category;
        uint money;
    }
        mapping (string => pattern) public patterns;   //имя шаблонов
        string[] public tempPatterns;
        string[] public categories;
        
    //Функция создания шаблонов
    function createPattern (string memory name, string memory category, uint money) public {
        require(keccak256(abi.encode(name)) !=  keccak256(abi.encode(patterns["name"])), "");
        require(money > 0, "error: little money!");
        patterns[name] = pattern(category, money);
        tempPatterns.push(name);
    }
    //Функция просмотра шаблонов
    function viewPatterns () public view returns(string[] memory) {
        return(tempPatterns);
    }
    
    //Функция создания категорий
    function createCatefories (string memory name) public {
        categories.push(name);
    }
    //Функция просмотра категории
    function viewCategories () public view returns(string[] memory) {
        return(categories);
    }
    //____________________________________________________________________________________________________________________________________________________________________
    
    
    //_____________________________________________________________ФУНКЦИИ ПЕРЕВОДОВ______________________________________________________________________________________
    //Структура перевода
    struct Transfer {
        address fromAddress;
        address toAddress;
        uint value;
        bytes32 codewordHash;
        uint categoryId;
        string description;
        uint time;
        bool finished;
    }
    
    Transfer[] public transfers;

    function getTransferID() public view returns(uint) {
        return(transfers.length-1);
    }
    
    function createTransfer(address toAddress, string memory codeword, uint categoryId, string memory description) public payable {
        require(msg.value > 0);
        require(msg.sender != toAddress);
        require(getHash(categories[categoryId]) != getHash(""));
        transfers.push(Transfer(msg.sender, toAddress, msg.value, getHash(codeword), categoryId, description, 0, false));
    }
    
    function confirmTransfer(uint transferId, string memory codeword) public payable {
        require(transfers[transferId].finished == false);
        require(msg.sender == transfers[transferId].toAddress, "Not for you");
        if (transfers[transferId].codewordHash == getHash(codeword)) {
            payable(msg.sender).transfer(transfers[transferId].value);
            transfers[transferId].time = block.timestamp;
        }
        else {
            payable(transfers[transferId].fromAddress).transfer(transfers[transferId].value);
        }
        transfers[transferId].finished = true;
    }
    
    function cancelTransfer(uint transferId) public payable {
        require(transfers[transferId].finished == false);
        require(msg.sender == transfers[transferId].fromAddress);
        payable(msg.sender).transfer(transfers[transferId].value);
        transfers[transferId].finished = true;
    }
    //____________________________________________________________________________________________________________________________________________________________________
    
    //_____________________________________________________________ФУНКЦИИ ГОЛОСОВАНИЯ__________________________________________________________________________
    //Структура голосования
    struct userUp {
        address adrUserUp;
        address[] lengthVoteFor;   //голос ЗА
        address[] lengthVoteAgain; //голос ПРОТИВ
        bool status;
    }
        mapping (uint => userUp) public userUps;
        uint voteFor = 0;   //голос ЗА
        uint voteAgain = 0; //голос ПРОТИВ
        uint lenghtIdUserUps = 0;

    //Функция просмотра длины   
    function getLenghtIdUserUps() public view returns(uint) {
        return(lenghtIdUserUps);
    }

    function checkBoost(uint idUserUps) public {
        if  (keccak256(abi.encode(userUps[idUserUps].lengthVoteFor.length)) == keccak256(abi.encode(adminAmount))) {
        users[userUps[idUserUps].adrUserUp].role = true;
        userUps[idUserUps].status = false;
        adminAmount ++;
        } 
    }
    
    //Проверяем не проголосовал ли пользователь уже
    modifier checkVote (uint idUserUps) {      
        bool vote = false;
        for (uint i = 0; i < userUps[idUserUps].lengthVoteFor.length; i++) { 	//смотрим на весь список голосов ЗА и ищем там админа, который пытается проголосовать
            if (userUps[idUserUps].lengthVoteFor[i] == msg.sender) {
                vote = true;
                break;
            }
        }
        require(vote == false, "error: already voted"); // ошибка, уже проголосовал
        _;
    }
        
    //Список голос ЗА
    function getVoteFor (uint idUserUps) public view returns(address[] memory) {
        return(userUps[idUserUps].lengthVoteFor);
    }
    //Список голос ПРОТИВ
    function getVoteAgain (uint idUserUps) public view returns(address[] memory) {
        return(userUps[idUserUps].lengthVoteAgain);
    }
    //Количество голос ЗА
    function countVoteFor(uint idUserUps) public view returns(uint count) {
        return userUps[idUserUps].lengthVoteFor.length;
    }
    //Количество голос ПРОТИВ
    function countVoteAgain(uint idUserUps) public view returns(uint count) {
        return userUps[idUserUps].lengthVoteFor.length;
    }
    
    //Функция повышения пользователя, тот кто создал отдает голос ЗА
    function offersToUesrUp (address adrUserUp) public onlyAdmin {
        require(users[adrUserUp].role == false, "error: he is admin!");
        address[] memory zerroArray;
        userUps[lenghtIdUserUps] = userUp(adrUserUp, zerroArray, zerroArray, true);
        userUps[lenghtIdUserUps].lengthVoteFor.push(msg.sender);
        lenghtIdUserUps += 1;
    }
    //Голос ЗА
    function voitingFor (uint idUserUps) public onlyAdmin checkVote(idUserUps) {
        userUps[idUserUps].lengthVoteFor.push(msg.sender);
        checkBoost(idUserUps);
    }
    //Голос ПРОТИВ
    function voitingAgain (uint idUserUps) public onlyAdmin checkVote(idUserUps) {
        require(userUps[idUserUps].status == true, "error: already finished!");
        userUps[idUserUps].lengthVoteAgain.push(msg.sender);
        userUps[idUserUps].status = false;
    }
    
    //Выдвижения пользователя на роль админы
    function goToUesrUp (uint idUserUps) public onlyAdmin {
        uint countVoitingFor = userUps[idUserUps].lengthVoteFor.length; //список голосов ЗА
        if(keccak256(abi.encode(adminAmount)) == keccak256(abi.encode(countVoitingFor))) {
            users[userUps[idUserUps].adrUserUp].role = true;
            adminAmount += 1;
            userUps[idUserUps].status = false;
        }
    }
    //____________________________________________________________________________________________________________________________________________________________________
}
