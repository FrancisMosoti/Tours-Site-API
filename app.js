const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const app = express();
const port = 3000;
// morgan middleware
app.use(morgan('dev'));

// middleware
app.use(express.json());

app.use((req, res, next) => {
  console.log('Hello from the middleware');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

const tours = fs.readFileSync(
  `${__dirname}/dev-data/data/tours-simple.json`,
  'utf-8',
);
const toursData = JSON.parse(tours);

// route handlers
const getAllTours = (req, res) => {
  console.log(req.requestTime);

  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: toursData.length,
    data: {
      tours: toursData,
    },
  });
};

const postTour = (req, res) => {
  //   console.log(req.body);

  const newId = toursData[toursData.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  toursData.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(toursData),

    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    },
  );
};

const updateTour = (req, res) => {
  const id = parseInt(req.params.id);
  if (id > toursData.length - 1) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  return res.status(200).json({
    status: 'success',
    data: {
      tour: 'Updated tour',
    },
  });
};

const deleteTour = (req, res) => {
  const id = parseInt(req.params.id);
  if (id > toursData.length - 1) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  return res.status(204).json({
    status: 'success',
    data: null,
  });
};

const getSingleTour = (req, res) => {
  console.log(req.params);

  const id = parseInt(req.params.id);

  const tour = toursData.find((el) => el.id === id);

  //   if (id > toursData.length - 1) {
  //     return res.status(404).json({
  //       status: 'fail',
  //       message: 'Invalid ID',
  //     });
  //   }

  if (!tour) {
    return res.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: tour,
    },
  });
};

// users route handlers
const getAllUsers = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

const createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};
const getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};
const updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};
const deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};

// routes

// app.get('/api/v1/tours', getAllTours);

// app.post('/api/v1/tours', postTour);

// app.patch('/api/v1/tours/:id', updateTour);

// app.delete('/api/v1/tours/:id', deleteTour);

// app.get('/api/v1/tours/:id', getSingleTour);

// chaining route handlers

const tourRouter = express.Router();
const userRouter = express.Router();

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// tours routes
tourRouter.route('/').get(getAllTours).post(postTour);

tourRouter
  .route('/:id')
  .patch(updateTour)
  .delete(deleteTour)
  .get(getSingleTour);

// users routes
userRouter.route('/').get(getAllUsers).post(createUser);

userRouter.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

// starting the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}... `);
});
module.exports = app;
