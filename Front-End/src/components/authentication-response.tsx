import { BasicUserInfo } from "@asgardeo/auth-react";
import React, { FunctionComponent, ReactElement, useState } from "react";
import { JsonViewer } from '@textea/json-viewer'
import {
    Button, Dropdown, Menu, Avatar, Layout, theme, Modal,
    Form, Input, Card, Row, Col, DatePicker, Select, Tooltip
} from 'antd';
import logo from '../images/logo.png';
import userAvatar from '../images/avatar.png';
import {
    CalendarOutlined, EnvironmentOutlined, DeleteOutlined,
    LinkOutlined, StarOutlined, ProfileOutlined, EditOutlined
} from '@ant-design/icons';

const { Header, Content, Footer } = Layout;

/**
 * Decoded ID Token Response component Prop types interface.
 */
interface AuthenticationResponsePropsInterface {
    /**
     * Derived Authenticated Response.
     */
    onLogOutClick: () => void;
    derivedResponse?: any;
}

export interface DerivedAuthenticationResponseInterface {
    /**
     * Response from the `getBasicUserInfo()` function from the SDK context.
     */
    authenticateResponse: BasicUserInfo;
    /**
     * ID token split by `.`.
     */
    idToken: string[];
    /**
     * Decoded Header of the ID Token.
     */
    decodedIdTokenHeader: Record<string, unknown>;
    /**
     * Decoded Payload of the ID Token.
     */
    decodedIDTokenPayload: Record<string, unknown>;
}

/**
 * Displays the derived Authentication Response from the SDK.
 *
 * @param {AuthenticationResponsePropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const AuthenticationResponse: FunctionComponent<AuthenticationResponsePropsInterface> = (
    props: AuthenticationResponsePropsInterface
): ReactElement => {

    const calculateCountdown = (endDate) => {
        const end = new Date(endDate);
        const now = new Date();
        const difference = end - now; // difference in milliseconds
        const days = Math.floor(difference / (1000 * 60 * 60 * 24)); // convert milliseconds to days
        return days;
    };

    const handleUpdate = (values) => {
        const updatedConferences = conferences.map(conference =>
            conference.id === currentConference.id ? { ...conference, ...values, conferenceDate: values.conferenceDate.format('YYYY-MM-DD') } : conference
        );
        setConferences(updatedConferences);
        setIsModalVisible(false);
    };

    const handleDelete = (conferenceId) => {
        setConferences(conferences.filter(conference => conference.id !== conferenceId));
    };

    // Styles for the card and its elements
    const cardStyle = {
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        borderRadius: '8px',
        margin: '10px',
        overflow: 'hidden',
        transition: 'transform 0.3s ease-in-out',
        ':hover': {
            transform: 'scale(1.03)'
        }
    };

    const contentStyle = {
        padding: '20px'
    };

    const iconStyle = {
        marginRight: '8px',
        color: 'rgba(0, 0, 0, 0.65)'
    };

    const footerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        borderTop: '1px solid #f0f0f0',
        padding: '10px 20px',
        marginTop: '10px',
        fontSize: '0.9em'
    };

    const rankStyle = {
        position: 'absolute',
        top: '10px',
        right: '10px',
        backgroundColor: '#fadb14',
        color: '#fff',
        padding: '5px 10px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    };

    const typeStyle = {
        position: 'absolute',
        top: '10px',
        left: '10px',
        backgroundColor: '#EC5800',  // A distinct color for the type banner
        color: '#fff',
        padding: '5px 10px',
        borderRadius: '0 8px 8px 0',  // Rounded corners on the right side
        fontSize: '0.85em',
        fontWeight: 'bold'
    };

    const dummyConferences = [
        {
            id: '1',
            title: "Tech Innovate 2024",
            organization: "Tech World Inc.",
            type: "Conference",
            description: "Explore cutting-edge tech innovations.",
            location: "San Francisco, CA",
            paperSubmissionDate: "2024-12-01",
            conferenceDate: "2024-03-15",
            externalLink: "https://techinnovate2024.com",
            rank: "A"
        },
        {
            id: '2',
            title: "Global Health Summit",
            organization: "Health Org",
            type: "Conference",
            description: "Addressing global health challenges and solutions.",
            location: "Geneva, Switzerland",
            paperSubmissionDate: "2023-10-20",
            conferenceDate: "2024-05-10",
            externalLink: "https://globalhealth2024.com",
            rank: "A*"
        },
        {
            id: '3',
            title: "Global Health Summit - 3",
            type: "Conference",
            description: "Addressing global health challenges and solutions.",
            location: "Geneva, Switzerland",
            paperSubmissionDate: "2023-10-20",
            conferenceDate: "2024-05-10",
            externalLink: "https://globalhealth2024.com",
            rank: "A*"
        },
        {
            id: '4',
            title: "Global Health Summit - 4",
            organization: "Health Org",
            type: "Conference",
            description: "Addressing global health challenges and solutions.",
            location: "Geneva, Switzerland",
            paperSubmissionDate: "2023-10-20",
            conferenceDate: "2024-05-10",
            externalLink: "https://globalhealth2024.com",
            rank: "A*"
        },
        {
            id: '5',
            title: "Global Health Summit -5",
            organization: "Health Org",
            type: "Conference",
            description: "Addressing global health challenges and solutions.",
            location: "Geneva, Switzerland",
            paperSubmissionDate: "2023-10-20",
            conferenceDate: "2024-05-10",
            externalLink: "https://globalhealth2024.com",
            rank: "A"
        }
    ];

    const [conferences, setConferences] = useState(dummyConferences);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
    const [currentConference, setCurrentConference] = useState(null);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const showUpdateModal = (conference) => {
        setCurrentConference(conference);
        setIsUpdateModalVisible(true);
    };

    const handleOk = (values: { name: string; description: string; }) => {
        setConferences([...conferences, { ...values, conferenceDate: values.conferenceDate.format('YYYY-MM-DD') }]);
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 },
    };
    const tailLayout = {
        wrapperCol: { offset: 6, span: 16 },
    };

    const {
        onLogOutClick,
        derivedResponse
    } = props;

    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const menu = (
        <Menu>
            <Menu.Item key="myaccount" onClick={onLogOutClick}>
                My Account
            </Menu.Item>
            <Menu.Item key="logout" onClick={onLogOutClick}>
                Logout
            </Menu.Item>
        </Menu>
    );
    const [form] = Form.useForm();
    return (
        <>
            <Layout>
                <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <img src={logo} alt="Logo" style={{ height: '32px', marginRight: '10px' }} />
                        <span style={{ color: 'white' }}>Conference Sphere</span>
                    </div>
                    <div>
                        <Dropdown overlay={menu} trigger={['click']}>
                            <a onClick={(e) => e.preventDefault()} href="/">
                                <Avatar src={userAvatar} style={{ marginRight: '10px' }} />
                                {derivedResponse?.authenticateResponse?.username} <span className="ant-dropdown-link"></span>
                            </a>
                        </Dropdown>
                    </div>
                </Header>
                <Content style={{ padding: '0 20px' }}>
                    <div
                        style={{
                            background: colorBgContainer,
                            minHeight: 280,
                            padding: 24,
                            borderRadius: borderRadiusLG,
                        }}
                    >
                        <Button type="primary" onClick={showModal}>
                            Add New Conference
                        </Button>
                        <Modal title="Add New Conference" visible={isModalVisible} onCancel={handleCancel} footer={null}>
                            <Form onFinish={handleOk} layout="vertical">
                                <Form.Item name="title" label="Title" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                                <Form.Item name="organization" label="Organization" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                                <Form.Item name="type" label="Type" rules={[{ required: true }]}>
                                    <Select>
                                        <Option value="Conference">Conference</Option>
                                        <Option value="Journal">Journal</Option>
                                    </Select>
                                </Form.Item>
                                <Form.Item name="description" label="Description" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                                <Form.Item name="location" label="Location" rules={[{ required: true }]}>
                                    <Input />
                                </Form.Item>
                                <Form.Item name="paperSubmissionDate" label="Paper Submission Date" rules={[{ required: true }]}>
                                    <DatePicker format="YYYY-MM-DD" />
                                </Form.Item>
                                <Form.Item name="conferenceDate" label="Conference Date/Journal Publication Date" rules={[{ required: true }]}>
                                    <DatePicker format="YYYY-MM-DD" />
                                </Form.Item>
                                <Form.Item name="externalLink" label="External Link">
                                    <Input />
                                </Form.Item>
                                <Form.Item name="rank" label="Rank" >
                                    <Input placeholder="A"/>
                                </Form.Item>
                                <Button type="primary" htmlType="submit">
                                    Submit
                                </Button>
                            </Form>
                        </Modal>

                        <Row gutter={16} style={{ marginTop: 20 }}>
                            {conferences.map((conference, index) => (
                                <Col key={index} xs={24} sm={12} lg={8}>
                                    <Card
                                        hoverable
                                        style={cardStyle}
                                        cover={
                                            <h3><ProfileOutlined style={iconStyle} />{conference.title}</h3>
                                        }
                                    >
                                        <div style={contentStyle}>
                                            <p>{conference.description}</p>
                                            <p><EnvironmentOutlined style={iconStyle} />{conference.location}</p>
                                            <p><LinkOutlined style={iconStyle} /><a href={conference.externalLink} target="_blank" rel="noopener noreferrer">More Info</a></p>
                                        </div>
                                        <div style={footerStyle}>
                                            <span><CalendarOutlined />Submission: <br />{conference.paperSubmissionDate} <br /> in {calculateCountdown(conference.paperSubmissionDate)} days</span>
                                            <span><CalendarOutlined />Event: <br />{conference.conferenceDate} <br /> in {calculateCountdown(conference.conferenceDate)} days</span>
                                        </div>
                                        <div style={rankStyle}>
                                            <Tooltip title="Conference Rank">
                                                <StarOutlined /> {conference.rank}
                                            </Tooltip>
                                        </div>
                                        <div style={typeStyle}>
                                            {conference.type}
                                        </div>
                                        <div>
                                            <Button type="primary" ghost icon={<EditOutlined />} onClick={() => showUpdateModal(conference)}>
                                                Update
                                            </Button>
                                            <Button style={{ margin: '10px' }} danger ghost icon={<DeleteOutlined />} onClick={() => handleDelete(conference.id)}>
                                                Delete
                                            </Button>
                                        </div>
                                    </Card>
                                </Col>
                            ))}
                        </Row>

                    </div>
                </Content>
                <Modal title="Update Conference" visible={isUpdateModalVisible} onCancel={() => setIsUpdateModalVisible(false)} onOk={() => form.submit()}>
                    <Form form={form} onFinish={handleUpdate} initialValues={currentConference}>
                        <Form.Item name="title" label="Title">
                            <Input />
                        </Form.Item>
                        <Form.Item name="conferenceDate" label="Conference Date">
                            <DatePicker />
                        </Form.Item>
                    </Form>
                </Modal>
            </Layout>
        </>
    );
};
