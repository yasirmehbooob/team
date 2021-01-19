const express = require("express");
const jwt = require("jsonwebtoken");
const Sequelize = require("sequelize");
const Members = require("./models/Users");
const Teams = require("./models/Teams");
const TeamMembers = require("./models/TeamMembers");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// eslint-disable-next-line no-undef
const port = process.env.PORT || 8000;

/**
 * @api {post} /creat/user/ Create User
 * @apiName CreateUser
 * @apiGroup User
 *
 * @apiParam none
 *
 * @apiSuccess {String} User Created
 */
app.post("/api/create/user", verifyToken, (req, res) => {
  Members.create({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    password: req.body.password,
    designation: req.body.designation,
    phone_num: req.body.phone_num,
    image: req.body.image,
    resume: req.body.resm,
  }).then((user) => {
    res.json({
      message: "user created successfully",
      data: user,
    });
  });
});

/**
 * @api {post} /creat/team/ Create Team
 * @apiName CreateTeam
 * @apiGroup Team
 *
 * @apiParam none
 *
 * @apiSuccess {String} Team Created
 */
app.post("/api/create/team", verifyToken, (req, res) => {
  Teams.create({
    name: req.body.name,
    discription: req.body.discription,
    tags: req.body.tags,
  }).then((team) => {
    res.json({
      message: "team created successfully",
      data: team,
    });
  });
});

/**
 * @api {post} /assign/team/ We Simply Assign Some Members in a Team
 *
 * @apiName AssignTeamMembers
 * @apiGroup Team
 *
 * @apiParam none
 *
 * @apiSuccess {String} Members Assigned
 */
app.post("/api/assign/team", verifyToken, (req, res) => {
  let member = req.body.member_id.split(",");
  member.forEach((element) => {
    TeamMembers.create({
      teamId: req.body.team_id,
      userId: element,
    });
  });

  res.json({ message: "members are assigned successfully" });
});

/**
 * @api {get} /user/ Get Users List
 * @apiName GetUsers
 * @apiGroup User
 *
 * @apiParam none
 *
 * @apiSuccess {String} Users List Json Responce
 */
app.get("/api/users", verifyToken, (req, res) => {
  // jwt.verify(req.token, 'secretKey', (err, data) => {
  //     if(err){
  //         res.json({message: 'invalid user'});
  //     }
  // });
  Members.findAll({
    order: [["id", "ASC"]],
  }).then((users) => {
    res.json(users);
  });
});

/**
 * @api {post} /team/ Get Team Info and Their Members
 * @apiName GetTeamWithMembers
 * @apiGroup Team
 *
 * @apiParam :id => team id
 *
 * @apiSuccess {String}  Team Details With Members List
 */
app.get("/api/team/:id", verifyToken, (req, res) => {
  Teams.findAll({
    where: {
      id: req.params.id,
      is_deleted: { [Sequelize.Op.not]: 1 },
    },
    include: [Members],
    order: [["id", "ASC"]],
  }).then((team) => {
    if (team.length === 0) {
      res.json({ message: "no team exist or deleted" });
    }
    res.json(team);
  });
});

/**
 * @api {post} /delete/team/ Soft Delete a Team
 * @apiName DeleteTeam
 * @apiGroup Team
 *
 * @apiParam :id => team id
 *
 * @apiSuccess {String}  Team Deleted and Also Un-Assigned All Members Of That Team
 */
app.post("/api/delete/team/:id", verifyToken, (req, res) => {
  Teams.update(
    {
      is_deleted: 1,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  ).then(() => {
    TeamMembers.destroy({
      where: {
        teamId: req.params.id,
      },
    }).then(() => {
      res.json({ message: "team deleted and unassigned members successfully" });
    });
  });
});

/**
 * @api {post} /user/ Get User Info With Teams
 * @apiName GetTeamWithMembers
 * @apiGroup User
 *
 * @apiParam :id => user id
 *
 * @apiSuccess {String}  User Details With Team List
 */
app.get("/api/user/:id", verifyToken, (req, res) => {
  Members.findByPk(req.params.id, {
    include: [Teams],
  }).then((user) => {
    res.json(user);
  });
});

/**
 * @api {post} /update/user/ Update User Info
 * @apiName UpdateUserInfo
 * @apiGroup User
 *
 * @apiParam :id => user id
 * @apiBodyParams name,details,tags
 *
 * @apiSuccess {String}  User Details Updated
 */
app.post("/api/update/user/:id", verifyToken, (req, res) => {
  Members.update(
    {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  ).then(() => {
    Members.findByPk(req.params.id).then((user) => {
      res.json({
        message: "user updated successfully",
        data: user,
      });
    });
  });
});

/**
 * @api {post} /update/team/ Update Team Info
 * @apiName UpdateTeamInfo
 * @apiGroup Team
 *
 * @apiParam :id => team id
 * @apiBodyParams name,details,tags
 *
 * @apiSuccess {String}  Team Details Updated
 */
app.post("/api/update/team/:id", verifyToken, (req, res) => {
  Teams.update(
    {
      name: req.body.name,
      discription: req.body.discription,
      tags: req.body.tags,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  ).then(() => {
    Teams.findByPk(req.params.id).then((team) => {
      res.json({
        message: "team updated successfully",
        data: team,
      });
    });
  });
});

/**
 * @api {post} /update/team/members Update Team Members Info
 * @apiName UpdateTeamMembers
 * @apiGroup Team
 *
 * @apiParam :id => team id
 * @apiBodyParams members_id
 *
 * @apiSuccess {String}  Team Members Are Assigned Or Updated
 */
app.post("/api/update/team-members/:id", verifyToken, async (req, res) => {
  TeamMembers.truncate({
    where: {
      teamId: req.params.id,
    },
  }).then(() => {
    let member = req.body.member_id.split(",");
    member.forEach((element) => {
      TeamMembers.create({
        teamId: req.params.id,
        userId: element,
      });
    });
  });
  await TeamMembers.findAll({ where: { teamId: req.params.id } }).then(
    (team_members) => {
      res.json({
        data: team_members,
        message: "team updated successfully",
      });
    }
  );
});

/**
 * @api {post} /user/login/ Login User
 * @apiName UserLogin
 * @apiGroup User
 *
 * @apiBodyParams :email, :password
 *
 * @apiSuccess {String}  Login Success with Valid Token
 */
app.post("/api/login", (req, res) => {
  Members.findAll({
    where: {
      email: req.body.email,
      password: req.body.password,
    },
  }).then((member) => {
    if (member) {
      jwt.sign(
        { member, iat: Math.floor(Date.now() / 1000) - 30 },
        "secretKey",
        (err, token) => {
          res.json({ token });
        }
      );
    }
  });
});

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 *
 * @function middleware function for verify token
 */
function verifyToken(req, res, next) {
  const brearheader = req.headers["authorization"];
  if (typeof brearheader !== "undefined") {
    const breartoken = brearheader.split(" ");
    const token = breartoken[1];
    if (token) {
      // req.token = token;
      jwt.verify(token, "secretKey", (err, data) => {
        if (err) {
          res.json({ message: "invalid user" });
        } else {
          req.auth = data;
        }
      });
      next();
    }
  } else {
    res.sendStatus(404);
  }
}

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 *
 * @function start server on passed port usually 8000
 */
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
