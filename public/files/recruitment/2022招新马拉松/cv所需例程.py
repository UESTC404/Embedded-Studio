# import os
# os.environ["CUDA_VISIBLE_DEVICES"] = "-1"
#用上述代码在深度学习时禁用GPU

# config = tf.compat.v1.ConfigProto(allow_soft_placement=True)
# config.gpu_options.per_process_gpu_memory_fraction = 0.7
# tf.compat.v1.keras.backend.set_session(tf.compat.v1.Session(config=config))
#减小GPU显存的占用量

#原项目地址
#https://data-flair.training/blogs/create-emoji-with-deep-learning/

import numpy as np
import cv2
from keras.models import Sequential
from keras.layers import Dense, Dropout, Flatten
from keras.layers import Conv2D
from keras.optimizers import adam_v2
from keras.layers import MaxPooling2D
import tensorflow as tf


from keras.preprocessing.image import ImageDataGenerator


# 读入神经网络学习需要的训练集和测试集图片
train_dir = '../ML-Pytorch/data/train'
val_dir = '../ML-Pytorch/data/test'
train_datagen = ImageDataGenerator(rescale=1./255)
val_datagen = ImageDataGenerator(rescale=1./255)
train_generator = train_datagen.flow_from_directory(
        train_dir,
        target_size=(48,48),
        batch_size=64,
        color_mode="grayscale",
        class_mode='categorical')
validation_generator = val_datagen.flow_from_directory(
        val_dir,
        target_size=(48,48),
        batch_size=64,
        color_mode="grayscale",
        class_mode='categorical')

#这里搭建了神经网络的框架，包括多个卷积层，池化层和Dropout层
model = Sequential()
model.add(Conv2D(32, kernel_size=(3, 3), activation='relu', input_shape=(48,48,1)))
model.add(Conv2D(64, kernel_size=(3, 3), activation='relu'))
model.add(MaxPooling2D(pool_size=(2, 2)))
model.add(Dropout(0.25))
model.add(Conv2D(128, kernel_size=(3, 3), activation='relu'))
model.add(MaxPooling2D(pool_size=(2, 2)))
model.add(Conv2D(128, kernel_size=(3, 3), activation='relu'))
model.add(MaxPooling2D(pool_size=(2, 2)))
model.add(Dropout(0.25))
model.add(Flatten())
model.add(Dense(1024, activation='relu'))
model.add(Dropout(0.5))
model.add(Dense(7, activation='softmax'))

# 这里定义了损失函数
model.compile(loss='categorical_crossentropy',optimizer=adam_v2.Adam(lr=0.0001, decay=1e-6),metrics=['accuracy'])

#开始训练
model_info = model.fit_generator(
        train_generator,
        steps_per_epoch=28709 // 64,
        epochs=50,
        validation_data=validation_generator,
        validation_steps=7178 // 64)

#存储训练结果（神经网络架构和权值）
model.save('model.h5')

emotion_dict = {0: "   Angry   ", 1: "Disgusted", 2: "  Fearful  ", 3: "   Happy   ", 4: "  Neutral  ",
                5: "    Sad    ", 6: "Surprised"}

#载入已经训练好的神经网络模型
model = tf.keras.models.load_model("./model.h5",compile=True)

#emotion_model.predict(img)   将待预测的图片传入函数，这个函数将返回一个ndarray格式的数组，里面存储了对每一个表情的预测概率

# 下一步，需要大家
# 1.调用电脑的前置摄像头，将实时图片输入Haar检测器，读取Haar级联检测器输出的坐标框选人脸
# 2.将框选裁剪的图片输入神经网络预测人脸的情绪
# 3.将预测结果绘制在opencv窗口中






